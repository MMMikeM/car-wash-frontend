image = car-wash-frontend:0.0.40
deploy:
	npm run build
	docker build . -t $(image)
	docker tag $(image) mmmikem/$(image)
	docker push mmmikem/$(image)
	rm -rf build
