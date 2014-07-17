var jobsApp = angular.module('jobsApp', []);

jobsApp.controller('jobCtrl', function ($scope) {

    /**
     * Callback for when a job finishes
     */
    var jobfinished = function () {
        $scope.$apply(); // this updates the scope and thus the UI once a job completed
        runNextJob();
    };

    /**
     * Find the next best optimized job to run right now
     */
    var runNextJob = function () {
        var bestSpeed = 10000000;
        var bestJob = null;
        var spedUpBy = null;

        var i, j, jobToRun, finishedJob, speed;

        loop:
            for (i = 0; i < $scope.jobs.length; i++) {
                jobToRun = $scope.jobs[i];
                if (jobToRun.status != 'new') continue;

                for (j = 0; j < $scope.jobs.length; j++) {
                    finishedJob = $scope.jobs[j];
                    if (finishedJob.status != 'finished') continue;

                    speed = jobToRun.speedUpBy(finishedJob);
                    if (speed < bestSpeed) {
                        bestSpeed = speed;
                        bestJob = jobToRun;
                        spedUpBy = finishedJob;
                    }
                    if (speed <= 0.3) {
                        break loop; // we already found the best case, no need to look further
                    }
                }
            }

        // We found nothing, maybe because we're bootstrapping
        if(bestJob === null) {
            for (i = 0; i < $scope.jobs.length; i++) {
                jobToRun = $scope.jobs[i];
                if (jobToRun.status != 'new') continue;
                if (jobToRun.size !== 0) continue;
                bestJob = jobToRun;
                bestSpeed = 1;
                break;
            }
        }

        // still nothing? we're probably done
        if(bestJob === null) {
            return;
        }

        if(spedUpBy !== null) {
            console.log('Running '+bestJob.toString() + ' using ' + spedUpBy.toString());
        }else{
            console.log('Running '+bestJob.toString());
        }
        bestJob.run(bestSpeed);
        $scope.runtime += bestJob.runtime;
        $scope.fulltime += bestJob.fulltime;
        $scope.realtime = (new Date) - starttime;
        $scope.$apply();
    };

    // create all the jobs
    $scope.jobs = [];
    for (var shape = 0; shape < 4; shape++) {
        for (var color = 0; color < 4; color++) {
            for (var size = 0; size < 8; size++) {
                $scope.jobs.push(new Job(size, color, shape, jobfinished));
            }
        }
    }

    // set timer vars
    $scope.fulltime = 0;
    $scope.runtime  = 0;
    $scope.realtime = 0;
    var starttime = new Date();

    // initialize the first 5 jobs
    for(var queue=0; queue < 5; queue++) {
        runNextJob();
    }
});