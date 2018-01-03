echo "Git add all and Show status"
git add *
STR=`git status`
echo "$STR"
read -p "Press enter to continue a commit......"
echo -e "Select Git Comment Type\n1.long type 2.short type (default : 1)"
read -p ">" type
if [ $type == "2" ]
then
    echo "Write git comment"
    read -p ">" msg
    git commit -m "$msg"
else
   git commit
fi
echo "finished......"
git log -5 --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit
read -p "Press enter to exit" out
exit $out
