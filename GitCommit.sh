echo "Git add all and Show status"
git add *
git status
read -p "Press enter to continue a commit......" 
echo "write git commit comment"
read msg
git commit -m "$msg"
echo "finished......"
git log -5 --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit
read -p "to push repo. press enter"

