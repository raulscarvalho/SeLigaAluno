class User {
    constructor(name, username, pfp, course, period, posts) {
        this.name= name;
        this.username = username;
        this.pfp = pfp;
        this.course = course;
        this.period = period;
        this.posts = posts;
    }

    post(post) {
        this.posts.append(post);
    }

}
