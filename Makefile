c:
	make -f Makefile_c

emcc:
	emcc -s WASM=1 -s EXPORT_ES6=1 -s EXPORTED_RUNTIME_METHODS='["getValue", "setValue"]' -s EXPORTED_FUNCTIONS="['_partition', '_malloc', '_main']" -o partition.js src/partition/main.c