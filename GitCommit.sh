echo "git add all and show status"
git add *
git status
read -p "Press enter to continue a commit......" 
echo "write git commit comment"
read msg
git commit -m "$msg"
echo "finished......"
git log -5 --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit
read -p "to push repo. press enter"
echo "Auto Git Pull & Git Push"    
read -p "Press enter to continue......"  
git pull && { git push && read -p "Success... Press enter to exit......" && exit 1 } || { echo "pull failed..." & exit 1 }
exit 1
