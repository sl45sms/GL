.DEFAULT_GOAL := gl.js
.PHONY: gl.js

test: gl.js
	node test.js test.gl

clean:
	rm gl.js

gl.js: 
	./node_modules/.bin/jison gl.y
