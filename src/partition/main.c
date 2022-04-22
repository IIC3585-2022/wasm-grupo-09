#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>

typedef struct subset
{
    int len;
    int* subset;
} Subset;


typedef struct answer
{
    int partition;
    Subset** subset;
    char* msg;
} Answer;


int accumulate(uint32_t* S, uint32_t n){
    int sum = 0;
    for(int i = 0; i<n; i++){
        sum += S[i];
    }
    return sum;
};

void clean(Answer* ans){
    for(int i=0; i<3; i++){
        free(ans->subset[i]->subset);
        free(ans->subset[i]);
    }
    free(ans->subset);
    free(ans);

};

// codigo obtenido de: https://www.techiedelight.com/3-partition-problem-extended-print-all-partitions/
int isSubsetExists(uint32_t* S, int n, int a, int b, int c, int* arr){
    if(a==0 && b==0 && c==0){
        return 1;
    }
    if(n<0){
        return 0;
    }
    //case 1: the current item becomes part of the first subset
    int A = 0;
    if(a - S[n] >= 0){
        arr[n]=1;
        A = isSubsetExists(S, n-1, a-S[n], b, c, arr);
    }
    //case 2: the current item becomes part of the second subset
    int B = 0;
    if(!A && (b-S[n]>=0)){
        arr[n]=2;
        B = isSubsetExists(S, n-1, a, b-S[n], c, arr);
    }
    //case 3: the current item becomes part of the third subset
    int C = 0;
    if((!A && !B) && (c-S[n] >= 0)){
        arr[n]=3;
        C = isSubsetExists(S, n-1, a, b, c-S[n], arr);
    }
    //return true if we get a solution
    return A || B || C;
};

int partition(uint32_t* S, uint32_t n, uint32_t* subset1, uint32_t* subset2, uint32_t* subset3){
    int sum = accumulate(S, n);
    int arr[n];
    int result = (n>=3) && !(sum%3) && isSubsetExists(S, n-1, (int) sum/3, (int) sum/3,(int) sum/3, arr);
    Answer* answer = malloc(sizeof(Answer));
    answer->partition = result;
    answer->subset = calloc(3, sizeof(Subset*));
    if(result){
        for(int i=0; i<3; i++){
            answer->subset[i] = malloc(sizeof(Subset));
            for(int j =0; j<n; j++){
                if(arr[j]== i+1){
                    answer->subset[i]->len++;
                }
            }
            answer->subset[i]->subset = calloc(answer->subset[i]->len, sizeof(int));
            
            int k=0;
            for(int j =0; j<n; j++){
                if(arr[j]== i+1){
                    answer->subset[i]->subset[k] = S[j];
                    if (i == 0) {
                        subset1[k] = S[j];
                    }
                    if (i == 1) {
                        subset2[k] = S[j];
                    }
                    if (i == 2) {
                        subset3[k] = S[j];
                    }
                    k++;
                }
            }
        }
    }
    answer->msg = "3-partition of set is not posible\n";
    
    if (!answer -> partition){
        clean(answer);
        return 0;
    }
    else {
        clean(answer);
        return 1;
    }
}


int main(){
    uint32_t S[7] = {7, 3, 2, 1, 5,4, 8};
    uint32_t size_arr = (uint32_t) sizeof(S);
    uint32_t n  = (uint32_t) (size_arr/sizeof(S[0]));
    uint32_t subset1[3];
    uint32_t subset2[3];
    uint32_t subset3[3];
    int result = partition(S,n, subset1, subset2, subset3);
    printf("%i %i\n", subset1[0], subset1[1]);
    if(!result){
        printf("No\n");
    }else{
        for(int i = 0; i<3; i++){
            printf("partition %i:", i);
            for(int j=0; j < 3; j++){
                if (i == 0){
                    printf(" %i ", subset1[j]);
                }
                if (i == 1){
                    printf(" %i ", subset2[j]);
                }
                if (i == 2) {
                    printf(" %i ", subset3[j]);
                }
            }
            printf("\n");
        }
    }
    return 0;
};
