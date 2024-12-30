import { Injectable } from '@angular/core';
import { BehaviorSubject, repeat, from } from 'rxjs';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';
import { WebStorageService } from '../services/webstorage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private keyLoggedIn: string = 'isLoggedIn';
  public isLogged: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false,
  );
  public profile: BehaviorSubject<KeycloakProfile | null> =
    new BehaviorSubject<KeycloakProfile | null>(null);
  public roles = new BehaviorSubject<string[]>([]);

  constructor(
    public readonly keycloak: KeycloakService,
    public readonly storageService: WebStorageService,
  ) {
    this.init();
  }

  public async init() {
    window.addEventListener('storage', async (event: StorageEvent) => {
      if (event.key === this.keyLoggedIn) {
        const isLoggedIn = this.storageService.get(this.keyLoggedIn);
        await this.getData(isLoggedIn);
      }
    });

    await this.getData(this.keycloak.isLoggedIn());

    from(this.keycloak.updateToken(30))
      .pipe(
        repeat({
          delay: 20 * 60 * 1000,
        }),
      )
      .subscribe();
    const roles = await this.getUserRoles();
    if (Array.isArray(roles)) {
      this.roles.next(roles);
    }
    console.log(roles);
  }

  public async getData(isLoggedIn: boolean) {
    this.isLogged.next(isLoggedIn);
    this.storageService.set(this.keyLoggedIn, isLoggedIn);

    if (isLoggedIn) {
      try {
        await this.keycloak.updateToken(30);
        const profile = await this.keycloak.loadUserProfile();
        this.profile.next(profile);
      } catch (e) {
        this.profile.next(null);
      }
    } else {
      this.profile.next(null);
    }
  }

  public login() {
    return this.keycloak.login();
  }

  public logout() {
    return this.keycloak.logout();
  }

  public getUserRoles() {
    return this.keycloak.getUserRoles();
  }

  public isUserInRole(role: string) {
    return this.keycloak.isUserInRole(role);
  }

  public roleChecker(role: string | string[] | undefined): boolean {
    if (!role) return true;
    if (Array.isArray(role)) {
      if (role.length === 0) return true;
      let res = false;
      role.forEach(el => {
        if (this.isUserInRole(el)) {
          res = true;
        }
      })
      return res;
    } else {
      return this.isUserInRole(role);
    }
  }
}
