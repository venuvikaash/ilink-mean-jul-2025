import java.util.*;

public class SpecialInteger {
    private boolean subarraysWithinMaxSum(ArrayList<Integer> A, int B, int K, long[] cumulativeSums) {
        int N = A.size();

        int i, j;

        if (N < K) {
            return false;
        }

        if (cumulativeSums[K - 1] > B) {
            return false;
        }

        for (i = K, j = 0; i < N; ++i, ++j) {
            if (cumulativeSums[i] - cumulativeSums[j] > B) {
                return false;
            }
        }

        return true;
    }

    public int solve(ArrayList<Integer> A, int B) {
        int N = A.size();
        long[] cumulativeSums = new long[N];

        long sum = A.get(0);
        cumulativeSums[0] = sum;

        for (int i = 1; i < N; ++i) {
            cumulativeSums[i] = cumulativeSums[i - 1] + A.get(i);
        }

        int left = 1, right = N, mid;
        int maxK = 0;

        while (left <= right) {
            mid = left + (right - left) / 2;

            if (subarraysWithinMaxSum(A, B, mid, cumulativeSums)) {
                maxK = mid;
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }

        return maxK;
    }

    public static void main(String[] args) {

    }
}