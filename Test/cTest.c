#include<stdio.h>
int main()
{
    double a,b;
    printf("�������һ��ʵ��a = \n");
    scanf("%lf",&a);
    printf("�������һ��ʵ��b = \n");
    scanf("%lf",&b);
    printf("a��b�ĺ� = a + b =\t %f\n",a+b);
    printf("a��b�Ĳ� = a - b =\t %f\n",a-b);
    printf("a��b�Ļ� = a �� b =\t %f\n",a*b);
    printf("a��b���� = a �� b =\t %f\n",a/b);
    return 0;
}