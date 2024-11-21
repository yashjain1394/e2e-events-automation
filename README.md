# e2e-events-automation
#Run below command to run the test case @registerEvent
npx run src/e2e -b webkit -p stage -t "@registerEvent"

#Run below command to run the test case @createEventRequiredFields
npx run src/e2e -b webkit -p stage -t "@createEventRequiredFields"

#Run below command to run the test case @createEventAllFields
npx run src/e2e -b webkit -p stage -t "@createEventAllFields"
