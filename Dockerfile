FROM node:18-alpine
RUN sudo apt update && sudo apt upgrade
RUN sudo apt install ffmpeg
WORKDIR /app
COPY package.json .
RUN yarn
COPY . .
EXPOSE 3002
CMD ["yarn","server"]
