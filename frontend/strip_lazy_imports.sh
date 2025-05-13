#!/bin/bash

FILE="frontend/containers/LazyContainers.js"

if [ ! -f "$FILE" ]; then
  echo "File not found: $FILE"
  exit 1
fi

echo "Modifying $FILE ..."

sed -i.bak '/dynamic(() => import.*BattlePage/d' "$FILE"
sed -i '/dynamic(() => import.*ProfilePage/d' "$FILE"
sed -i '/dynamic(() => import.*LoginPage/d' "$FILE"
sed -i '/dynamic(() => import.*RegisterPage/d' "$FILE"
sed -i '/dynamic(() => import.*PasswordResetPage/d' "$FILE"
sed -i '/dynamic(() => import.*PasswordResetConfirmPage/d' "$FILE"
sed -i '/dynamic(() => import.*VerificationSentPage/d' "$FILE"
sed -i '/dynamic(() => import.*EmailVerificationPage/d' "$FILE"
sed -i '/dynamic(() => import.*NotFoundPage/d' "$FILE"
sed -i '/dynamic(() => import.*PasswordProtectedPage/d' "$FILE"
sed -i '/dynamic(() => import.*PureHtmlPage/d' "$FILE"

echo "✅ LazyContainers.js has been stripped to minimal safe pages."
