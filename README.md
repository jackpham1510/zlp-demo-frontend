# ZaloPay Demo Front-End

Đây là phần giao diện (front-end) cho các demo tích hợp api của ZaloPay

# Cài đặt

1. [Nodejs](https://nodejs.org/en/)
2. [Yarn](https://yarnpkg.com/en/docs/install) (optional)
3. [Parceljs](https://parceljs.org/)

```bash
npm install -g parcel-bundler

# or

yarn global add parcel-bundler
```

4. Install dependencies

```bash
npm install

#or

yarn install
```

# Chạy project

```bash
npm run start

# or

yarn start
```

# Đổi config

Đổi host + port trong file [js/common.js](./js/common.js)

```js
export const HOST = "<new-host:port>";

...
```