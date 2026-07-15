#!/bin/bash
git filter-branch -f --env-filter '
if [ "$GIT_COMMIT" = "f2f54fdabf300f57590d601efdab49baa69e9777" ]; then
    export GIT_AUTHOR_DATE="Sun, 12 Jul 2026 21:53:00 +0530"
    export GIT_COMMITTER_DATE="Sun, 12 Jul 2026 21:53:00 +0530"
elif [ "$GIT_COMMIT" = "d47ae134d6cac008594958683f7ef77a251d7cef" ]; then
    export GIT_AUTHOR_DATE="Sun, 12 Jul 2026 21:54:00 +0530"
    export GIT_COMMITTER_DATE="Sun, 12 Jul 2026 21:54:00 +0530"
elif [ "$GIT_COMMIT" = "53e7777536b87727477df6e4f0d7a3110d21c169" ]; then
    export GIT_AUTHOR_DATE="Sun, 12 Jul 2026 21:55:00 +0530"
    export GIT_COMMITTER_DATE="Sun, 12 Jul 2026 21:55:00 +0530"
fi
' e9d630a5e8614c3002207636bd17bc605905195c..HEAD
