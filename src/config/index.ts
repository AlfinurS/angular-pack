interface IConfig {
  api: string;
}
export const testConf: IConfig = Object.freeze({
  api: 'https://dev.packer.yolka.io/',
});

export function getConfig(): IConfig {
  return testConf;
}
