CONAITNER_NAME:=backend
COMPOSE:=docker-compose -f ./docker-compose.yml

develop:
	@ $(COMPOSE) up -d
	@ $(COMPOSE) exec $(CONAITNER_NAME) /bin/bash ||true
	@ $(COMPOSE) stop
	@ $(COMPOSE) down
