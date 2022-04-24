DIST_NAME = physical

SCRIPT_FILES = \
	src/index.ts \
	src/settings.ts \
	src/Physical.ts \
	src/RMatrix4.ts \
	src/Maths.ts \
	src/Quaternion.ts \
	src/Camera.ts \
	src/Vector.ts \
	src/demo.ts \
	src/BasicPhysical.ts \
	test/test.ts

EXTRA_SCRIPTS =

include ./Makefile.microproject
