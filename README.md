# CHANGELOG
* 05.10.2022
  * Apparently, I am not eligible to ran any pipelines and leverage CICD. The `.gitlab-ci.yml` file was renamed to `_gitlab-ci.yml` file to prevent gitlab from running endless empty pipelines.
  * Accidentally, I renamed the default branch from `main` to `1-init` 😅. Decided not to spend much time on trying to rename it back/setting default branch name because I have limited permission though in GitLab with full set of permissions it could be done in a few clicks. From now the default branch is `1-init`. (Probably, I forgot to establish `main` branch(no files were there)).
  * Asp.Net Core framework is selected as the backend framework because it has many features out of the box and very good documentation.
  * ReactJs is selected as a frontend "framework" because it is my preferred lib for frontend development. Additionally, Material UI library was chosen for fast flow development because it provides a good set of components which are already styled. 
  