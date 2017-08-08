import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { FacebookService, InitParams, LoginOptions } from 'ngx-facebook';

import { JobService } from '../job.service';
import { Job } from '../Job';
import { UserService } from '../../User/user.service';

@Component({
  moduleId: module.id,
  selector: 'app-job-details',
  templateUrl: 'job-details.component.html',
  styleUrls: ['job-details.component.css'],
  providers: [FacebookService]
})

export class JobDetailsComponent implements OnInit {
  job: Job;
  profileLink: string;

  constructor(private facebookService: FacebookService, private jobService: JobService,
    private userService: UserService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.jobService.get(params['id']).subscribe(
        (job: any) => {
          this.job = job;
      });
      this.userService.getDetails(params['username']).subscribe(
        (job: any) => {
          this.job = job;
      });
    });

    this.facebookService.init({
      appId      : '1490087824391764',
      cookie     : true,
      xfbml      : true,
      version    : 'v2.8'
    });

    this.profileLink = location.href;
  }
}