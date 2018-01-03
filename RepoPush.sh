#load child directories in current position
#and do git pull && git push

pointer=`pwd`
DIR=`ls -d $pointer/*/`

for i in ${DIR};do
    echo "Entering directory to $i";
    cd $i;
    git pull && git push;
    cd ..;
done

read -p "Press enter to exit."