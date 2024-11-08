# e2e-events-automation
#Run below command to run the test case @registerEvent
npx run src/e2e -b webkit -p stage -t "@registerEvent"

#Run below command to run the test case @createEventWithRequiredFields
npx run src/e2e -b webkit -p stage -t "@createEventWithRequiredFields"

#Run below command to run the test case @createEventWithAllFields
npx run src/e2e -b webkit -p stage -t "@createEventWithAllFields"
