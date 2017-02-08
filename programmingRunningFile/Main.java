import java.util.Scanner;
public class Main {
	public int sum(int a, int b){
		return a+b;
	}

	public static void main(String args[]) {
		Scanner in1 = new Scanner(System.in);
		Scanner in2 = new Scanner(System.in);
		int n1 = in1.nextInt();
		int n2 = in2.nextInt();
		Main m = new Main();
		System.out.println(m.sum(n1, n2));
	}
}