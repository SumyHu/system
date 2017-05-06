昨天，重起服务器后出现MySQL 'localhost' (10061)错误，开始以为是因为数据库链接打开过多，数据库资源耗尽的缘故，但是重启服务器以后，仍旧出现问题，于是在网上查找解决方法。大体如下： 

解决办法： 
第一步 
删除c:\windows\下面的my.ini （D:\mysql-5.7.17-winx64\my-default.ini）
第二步 在dos下 输入 mysqld -nt -remove 删除服务 
在接着输入 mysqld -nt -install 
第三步 输入mysql 启动成功。