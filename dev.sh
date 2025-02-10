#!/usr/bin/env bash

set -eux

npm run dev > >(tee logs/dev.log) 2>&1 &
npm run cssw > >(tee logs/cssw.log) 2>&1 &
npm run test > >(tee logs/test.log) 2>&1 &

wait
