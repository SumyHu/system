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
 
insert into book values ( '9787115167408', 'JAVA SE 6.0 ���ָ�� ',   
 
' ���Ƿ� ; �ͳ� ',   
 
' �����ʵ������ ', '2007-11-00' , 874,   
 
' ������� ', 98.00 );   
 
insert into book values ( '7115138378',   
 
' ��ͨ Netbeans--Java ���桢 Web ����ҵ�����򿪷���� ',   
 
' ���Ƿ� ; ������ ',   
 
' �����ʵ������ ', '2007-2-10', 587,   
 
' ������� ', 75.00 );   
 
insert into book values ( '9787115167934', ' ����������������� ',   
 
'( ϣ�� )Diomidis Spinellis',   
 
' ��������� ', '2008-1-00', 384,   
 
' ������� ', 55.00 );   
 
insert into book values ( '9787111213826', 'Java ���˼�� ( �� 4 �� )',   
 
'( �� )Bruce Eckel',   
 
' ��е��ҵ������ ', '2007-6-00', 880,   
 
' ������� ', 108.00 );   
 
insert into book values ( '9787121048531', 'Struts 2 Ȩ��ָ�� ',   
 
' ��� ', ' ���ӹ�ҵ������ ', '2007-9-00', 715,   
 
' ������� ', 79.00 );   
 
insert into book values ( '9787111216322', 'JavaScript Ȩ��ָ�� ',   
 
'( �� )David Flanagan', ' ��е��ҵ������ ', '2007-8-00', 954,   
 
' ������� ', 109.00 );   
 
insert into book values ( '9787121042621', 'Spring 2.0 ���ļ��������ʵ�� ',   
 
' ��ѩ�� ', ' ���ӹ�ҵ������ ', '2007-6-00', 509,   
 
' ������� ', 59.80 );   
 
insert into book values ( '7505380001', 'Java ��ģʽ ',   
 
' �ֺ� ',   
 
' ���ӹ�ҵ������ ', '2002-10-00', 1024,   
 
' ������� ', 88.00 );   
 
insert into book values ( '9787302167792', 'VB 2005 & .NET 3.0 �߼���� ',   
 
'( �� )Bill Evjen; Billy Hollis;Bill Sheldon',   
 
' �廪��ѧ������ ', '2008-2-00' , 348,   
 
' ������� ', 45.00 );   
 
insert into book values ( '7115152098', ' JavaScript �߼�������� ',   
 
'Nicholas C.Zakas',   
 
' �����ʵ������ ', '2006-11-00' ,532,   
 
' ������� ', 59.00 );  