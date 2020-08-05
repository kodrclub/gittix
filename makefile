updatecommon:
	cd ./common &&	npm run pub
	cd ./auth && npm run upd
	cd ./expiration && npm run upd
	cd ./orders && npm run upd
	cd ./payments && npm run upd
	cd ./tickets && npm run upd