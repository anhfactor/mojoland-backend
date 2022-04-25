DEPLOY?=local

help:
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

pull: ## pull latest source code
	git pull || true

build: ## build container
	docker-compose -f docker-compose.yml build
build-start: ## build container & start
	docker-compose -f docker-compose.yml up -d --build
start: ## start container
	docker-compose -f docker-compose.yml up -d
restart: ## restart containter
	docker-compose -f docker-compose.yml restart
stop: ## stop & remove container
	docker-compose -f docker-compose.yml down
status: ## get status container
	docker-compose -f docker-compose.yml ps
logs: ## print latest container's logs
	docker-compose -f docker-compose.yml logs -f 