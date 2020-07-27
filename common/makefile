pub:
	@git add . && \
	git commit -am "New build" && \
	docker run --rm -it -v $(pwd):/app -v $HOME:/home/node -u node -w /app node:14.5.0-stretch npm run build
