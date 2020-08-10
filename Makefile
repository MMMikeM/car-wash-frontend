deploy:
	npm run build
	docker build . -t carwashappfe:0.0.17
	docker tag carwashappfe:0.0.17 mmmikem/car-wash-frontend:0.0.17
	docker push mmmikem/car-wash-frontend:0.0.17
	rm -rf build
