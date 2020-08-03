deploy:
	npm run build
	docker build . -t carwashappfe:0.0.7
	docker tag carwashappfe:0.0.7 mmmikem/car-wash-frontend:0.0.7
	docker push mmmikem/car-wash-frontend:0.0.7
	rm -rf build
