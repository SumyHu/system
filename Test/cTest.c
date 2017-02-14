#include<stdio.h>
int main()
{
    double a,b;
    printf("请输入第一个实数a = \n");
    scanf("%lf",&a);
    printf("请输入第一个实数b = \n");
    scanf("%lf",&b);
    printf("a和b的和 = a + b =\t %f\n",a+b);
    printf("a和b的差 = a - b =\t %f\n",a-b);
    printf("a和b的积 = a × b =\t %f\n",a*b);
    printf("a和b的商 = a ÷ b =\t %f\n",a/b);
    return 0;
}