#load child directories in current position
#and do git pull && git push
pointer=`pwd`
DIR=`ls -d $pointer/*/`

echo '###### GIT UPDATE & PUSH ######'
echo -e 'Press Number What you want\n 1. update \n 2. Pull & Push\n'
read -p ">" type
for i in ${DIR};do
    echo "Entering directory to $i";
    cd $i;    
        if [ $type == "2" ]
        then
            git pull && git push;
        else
            git pull;
        fi            
    cd ..;
done
read -p "Press enter to exit."