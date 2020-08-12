deploy:
	npm run build
	docker build . -t carwashappfe:0.0.22
	docker tag carwashappfe:0.0.22 mmmikem/car-wash-frontend:0.0.22
	docker push mmmikem/car-wash-frontend:0.0.22
	rm -rf build
