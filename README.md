# travelog

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

1. [ ] Show images in gallery without location
2. [ ] Allow user to pick/edit location
3. [ ] Style map marker popups
4. [ ] Add note card for each image
5. [ ] Map marker onclick --> Scroll image into view, open note card
6. [ ] Disable Edit buttons while uploading
7. [ ] Individual loader and status (add images on load and show loader/progress for each image).
8. [ ] Set map zoom and visible area based on uploaded images.
9. [ ] Write tests
10. [x] Hide Home page component `Register` when `loggedIn`
11. [x] Reroute to home on logout
12. [x] Pick color theme
13. [x] Refac full page loader and move to upload button
14. [x] ...
