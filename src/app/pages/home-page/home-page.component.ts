import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import {
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  ElementRef,
  inject,
} from '@angular/core';
import { FileUploadModule, FileSelectEvent } from 'primeng/fileupload';
import { HomeApiService } from '../../api/home.api.service';
import { Subscription, catchError, EMPTY } from 'rxjs';
import type { IUploadResponse, IUpload } from '../../types';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, FileUploadModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MessageService],
})
export class HomePageComponent {
  uploadedFiles: IUpload[] = [];
  maxFilesCount = 5;
  uploadRulesText =
    'Пожалуйста, выберите файл для загрузки (максимум 5 файлов за раз)';
  isMultipleUploading = true;
  readonly homeApiService = inject(HomeApiService);
  loading: boolean = false;
  subscriptions: Subscription[] = [];

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  constructor(private messageService: MessageService) {}

  openFileDialog() {
    this.fileInput.nativeElement.click();
  }

  handleFileInput(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const files: File[] = Array.from(input.files);

      if (files.length > this.maxFilesCount) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Превышено количество файлов',
          detail: `Можно загрузить максимум ${this.maxFilesCount} файла(ов) за раз`,
        });
        return;
      }
      files.forEach((file) => {
        this.uploadFileToServer(file);
      });
    }
    input.value = '';
  }

  uploadFileToServer(file: File) {
    const formData = new FormData();
    formData.append('files', file);

    this.loading = true;
    this.homeApiService.uploadFiles(formData).subscribe({
      next: (response: IUploadResponse) => {
        this.loading = false;
        response.pages.forEach((page) => {
          this.uploadedFiles.push(page);
        });
        this.messageService.add({
          severity: 'success',
          summary: 'Файл загружен',
          detail: `Файл ${file.name} успешно загружен на сервер`,
        });
      },
      error: (error) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Ошибка загрузки',
          detail: `Не удалось загрузить файл ${file.name}: ${
            error.error?.detail || 'Неизвестная ошибка'
          }`,
        });
        console.error('Ошибка загрузки файла:', error);
      },
    });
  }
}
