c:
	make -f Makefile_c

emcc:
	emcc -O3 -s ASSERTIONS=1 -s WASM=1 -s EXPORT_ES6=1 -s EXPORTED_RUNTIME_METHODS='["getValue", "setValue", "cwrap"]' -s EXPORTED_FUNCTIONS="['_partition', '_malloc']" -o partition.js src/partition/main.c
