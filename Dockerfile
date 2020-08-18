FROM node:12.2.0-alpine as build

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json yarn.lock /app/

RUN yarn install

RUN yarn global add react-scripts@3.0.1

COPY . /app

RUN yarn run build


# production environment

FROM nginx:1.16.0-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
