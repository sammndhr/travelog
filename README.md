# travelog

Travel diary to map travel pictures. [travelog.dev](http://travelog.dev/)

Directory structure

```bash
travelog
  ├── client
  │   ├── ...
  ├── server
  │   ├── ...
  ├── README.md
  └── ...
```

### Dev commands

Client

```bash
travelog/client:$ npm run serve
```

Server

```bash
travelog/server:$ npm start
```

### TODOs

1. [ ] Allow user to pick/edit location
2. [ ] Style map marker popups
3. [ ] Add note card for each image
4. [ ] Map marker onclick --> Scroll image into view, open note card
5. [ ] Disable Edit buttons while uploading
6. [ ] Individual loader and status (add images on load and show loader/progress for each image).
7. [ ] Set map zoom and visible area based on uploaded images.
8. [ ] Write tests
9. [x] Show images in gallery without location
10. [x] Hide Home page component `Register` when `loggedIn`
11. [x] Reroute to home on logout
12. [x] Pick color theme
13. [x] Refac full page loader and move to upload button
14. [x] ...
