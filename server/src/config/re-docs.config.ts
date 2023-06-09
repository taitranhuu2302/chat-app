import { RedocOptions } from 'nestjs-redoc';

export const redocOptions: RedocOptions = {
  title: 'Chat application',
  // logo: {
  //   url: 'https://redocly.github.io/redoc/petstore-logo.png',
  //   backgroundColor: '#F0F0F0',
  //   altText: 'PetStore logo',
  // },
  sortPropsAlphabetically: true,
  hideDownloadButton: false,
  hideHostname: false,
  // auth: {
  //   enabled: true,
  //   user: 'admin',
  //   password: '123',
  // },
  tagGroups: [
    {
      name: 'Core resources',
      tags: ['cats'],
    },
  ],
};
