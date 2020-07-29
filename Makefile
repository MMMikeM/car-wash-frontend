deploy:
	npm run build
	docker build . -t carwashappfe:0.0.5 
	docker tag carwashappfe:0.0.5 mmmikem/car-wash-frontend:0.0.5
	docker push mmmikem/car-wash-frontend:0.0.5
	rm -rf build