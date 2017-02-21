import java.util.Scanner;
public class Main {
	public int sum(int a, int b) {
		return a+b;
	}
	public static void main(String[] args) {
		Scanner input1 = new Scanner(System.in);
		Scanner input2 = new Scanner(System.in);
		int n1 = input1.nextInt();
		int n2 = input2.nextInt();
		Main instance = new Main();
		System.out.print(instance.sum(n1, n2));
	}
}