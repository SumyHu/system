use mysql;  
 
create table book   
 
(   
 
tisbn varchar(20) primary key,   
 
tbname varchar(100),   
 
tauthor varchar(30),   
 
chubanshe varchar(40),   
 
bookdate date,   
 
bookpage int,   
 
leixing varchar(20),   
 
bprice float(6,2)   
 
);   
 
insert into book values ( '9787115167408', 'JAVA SE 6.0 编程指南 ',   
 
' 吴亚峰 ; 纪超 ',   
 
' 人民邮电出版社 ', '2007-11-00' , 874,   
 
' 计算机类 ', 98.00 );   
 
insert into book values ( '7115138378',   
 
' 精通 Netbeans--Java 桌面、 Web 与企业级程序开发详解 ',   
 
' 吴亚峰 ; 王鑫磊 ',   
 
' 人民邮电出版社 ', '2007-2-10', 587,   
 
' 计算机类 ', 75.00 );   
 
insert into book values ( '9787115167934', ' 高质量程序设计艺术 ',   
 
'( 希腊 )Diomidis Spinellis',   
 
' 人民出版社 ', '2008-1-00', 384,   
 
' 计算机类 ', 55.00 );   
 
insert into book values ( '9787111213826', 'Java 编程思想 ( 第 4 版 )',   
 
'( 美 )Bruce Eckel',   
 
' 机械工业出版社 ', '2007-6-00', 880,   
 
' 计算机类 ', 108.00 );   
 
insert into book values ( '9787121048531', 'Struts 2 权威指南 ',   
 
' 李刚 ', ' 电子工业出版社 ', '2007-9-00', 715,   
 
' 计算机类 ', 79.00 );   
 
insert into book values ( '9787111216322', 'JavaScript 权威指南 ',   
 
'( 美 )David Flanagan', ' 机械工业出版社 ', '2007-8-00', 954,   
 
' 计算机类 ', 109.00 );   
 
insert into book values ( '9787121042621', 'Spring 2.0 核心技术与最佳实践 ',   
 
' 廖雪峰 ', ' 电子工业出版社 ', '2007-6-00', 509,   
 
' 计算机类 ', 59.80 );   
 
insert into book values ( '7505380001', 'Java 与模式 ',   
 
' 阎宏 ',   
 
' 电子工业出版社 ', '2002-10-00', 1024,   
 
' 计算机类 ', 88.00 );   
 
insert into book values ( '9787302167792', 'VB 2005 & .NET 3.0 高级编程 ',   
 
'( 美 )Bill Evjen; Billy Hollis;Bill Sheldon',   
 
' 清华大学出版社 ', '2008-2-00' , 348,   
 
' 计算机类 ', 45.00 );   
 
insert into book values ( '7115152098', ' JavaScript 高级程序设计 ',   
 
'Nicholas C.Zakas',   
 
' 人民邮电出版社 ', '2006-11-00' ,532,   
 
' 计算机类 ', 59.00 );  