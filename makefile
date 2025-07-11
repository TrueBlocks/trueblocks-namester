.PHONY: app

update:
	@go get "github.com/TrueBlocks/trueblocks-sdk/v5@latest"
	@go get github.com/TrueBlocks/trueblocks-core/src/apps/chifra@latest
	@go mod tidy
	@cd frontend ; yarn upgrade --latest ; cd -

make_code:
	@cd scripts ; go build -o /Users/jrush/source/make_code make_code.go

lint:
	@yarn lint

test:
	@export $(grep -v '^#' ../.env | xargs) >/dev/null && yarn test

generate:
	@cd ~/Development/trueblocks-core/build && make -j 12 goMaker && cd -
	@goMaker

app:
	@rm -fR build/bin
	@wails build
	@open build/bin/TrueBlocks\ Namester.app/

clean:
	@rm -fR node_modules
	@rm -fR frontend/node_modules
	@rm -fR build/bin

