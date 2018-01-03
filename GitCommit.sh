#cli type git commit shell script
#caution there is no exception

echo "Git add all and Show status"
git add *
git status
stat=`git status`
if [[ $stat != *"nothing to commit, working tree clean"* ]];
then
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
fi
read -p "Press enter to exit" out
exit $out

echo "auto git pull & git push"
read -p "Press enter to continue......"
git pull && { git push } || { echo "pull failed..." & exit 1 }