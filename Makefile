image = car-wash-frontend:0.0.22
deploy:
	npm run build
<<<<<<< HEAD
	docker build . -t carwashappfe:0.0.22
	docker tag carwashappfe:0.0.22 mmmikem/car-wash-frontend:0.0.22
	docker push mmmikem/car-wash-frontend:0.0.22
=======
	docker build . -t $(image)
	docker tag $(image) mmmikem/$(image)
	docker push mmmikem/$(image)
>>>>>>> 8a828ed6f7bdec839bde1853c93e8c6aab1ad282
	rm -rf build
