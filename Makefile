deploy:
	npm run build
	docker build . -t carwashappfe:0.0.19
	docker tag carwashappfe:0.0.19 mmmikem/car-wash-frontend:0.0.19
	docker push mmmikem/car-wash-frontend:0.0.19
	rm -rf build
