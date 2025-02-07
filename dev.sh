#!/usr/bin/env bash

set -eux

npm run dev > >(tee dev.log) 2>&1 &
npm run cssw > >(tee cssw.log) 2>&1 &
npm run test > >(tee test.log) 2>&1 &

wait
