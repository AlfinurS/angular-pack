interface IConfig {
  api: string;
}
export const testConf: IConfig = Object.freeze({
  api: 'https://packer.yolka.io/',
});

export function getConfig(): IConfig {
  return testConf;
}
