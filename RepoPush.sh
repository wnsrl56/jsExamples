echo "auto git pull & git push"
read -p "Press enter to continue......"
git pull && { git push } || { echo "pull failed..." & exit 1 }

