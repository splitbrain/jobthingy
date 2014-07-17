/**
 * Job Class
 *
 * @param {int} size
 * @param {int} color
 * @param {int} shape
 * @param {function} callback The function to run when the job finished
 */
function Job(size, color, shape, callback) {

    /**
     * A list of shapes for nicer display
     *
     * @type {Array}
     */
    this.shapes = ['♠', '♣', '♥', '♦', '♚', '♛', '♜', '♝', '♞', '♟'];

    /**
     * A list of colors for nicer display
     *
     * @type {Array}
     */
    this.colors = [
        'aqua', 'blue', 'fuchsia', 'green', 'lime', 'maroon',
        'navy', 'olive', 'purple', 'red', 'silver', 'teal', 'yellow'
    ];

    /**
     * The color as HTML color name
     *
     * @returns {string}
     */
    this.getColor = function () {
        return this.colors[this.color];
    };

    /**
     * The shape as unicode char
     *
     * @returns {string}
     */
    this.getShape = function () {
        return this.shapes[this.shape];
    };

    /**
     * Just the size
     *
     * @returns {*}
     */
    this.getSize = function () {
        return this.size;
    };

    /**
     * A string representation of size, shape and color
     *
     * @returns {string}
     */
    this.toString = function () {
        return this.getShape() + this.getSize() + this.getColor().substr(0, 1).toUpperCase();
    };

    /**
     * Start a job
     *
     * @param {number} mod Modify the runtime by multiplying this value.
     */
    this.run = function (mod) {
        this.status = 'running';
        this.runtime = this.runtime * mod;

        var self = this;
        window.setTimeout(
            function () {
                self.status = 'finished';
                self.onFinish.apply(self);
            },
            this.runtime
        );
    };

    /**
     * Check what speed up this job gains when the given job has been completed
     *
     * @param {Job} previousJob
     */
    this.speedUpBy = function (previousJob) {
        if (previousJob.color == this.color &&
            previousJob.shape == this.shape &&
            previousJob.size == this.size - 1) {
            return 0.3; // best case
        }

        if (previousJob.shape == this.shape &&
            previousJob.size == this.size) {
            return 0.5; // okay case
        }

        if (previousJob.color == this.color &&
            previousJob.size == this.size) {
            return 0.7; // meh case
        }

        return this.size+1; // no speed up at all, discourage running jobs with size > 0
    };

    /*
     * Constructor
     */

    this.size = size;
    this.color = color;
    this.shape = shape;
    this.fulltime = (size + 1) * 1000; //init runtimes based on size
    this.runtime = this.fulltime;
    this.status = 'new';

    this.onFinish = callback;
}

