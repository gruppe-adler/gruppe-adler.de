# Docker

Build:
```
docker build -t homepage .
```

Run:
```
docker run --rm --name homepage -v /home/sven/repos/gruppe-adler.de/api/config/:/usr/src/app/config -v /home/sven/repos/gruppe-adler.de/db/:/usr/src/app/data -p9000:80 homepage
```