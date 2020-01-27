from setuptools import setup, find_packages
import os

version = '1.0'

setup(name='lakof.theme',
      version=version,
      description="Diazo Theme for LAKOF",
      long_description=open("README.txt").read() + "\n" +
                       open(os.path.join("docs", "HISTORY.txt")).read(),
      # Get more strings from
      # http://pypi.python.org/pypi?%3Aaction=list_classifiers
      classifiers=[
        "Framework :: Plone",
        "Programming Language :: Python",
        "Topic :: Software Development :: Libraries :: Python Modules",
        ],
      keywords='',
      author='Alexander Loechel & Max Jakob',
      author_email='',
      url='http:// /lakof.theme',
      license='GPL version 2',
      packages=find_packages('src', exclude=['ez_setup']),
      package_dir={'': 'src'},
      namespace_packages=['lakof'],
      include_package_data=True,
      zip_safe=False,
      install_requires=[
          'setuptools',
          'z3c.jbot',
          # -*- Extra requirements: -*-
          # 'plonetheme.onegov',
          # 'ftw.footer',
          # 'wildcard.foldercontents',
          # 'plone.app.contenttypes',
          # 'plone.app.event',
          # 'collective.quickupload',
          # 'Products.PloneFormGen',
          # 'Products.ImageEditor',
      ],
      entry_points="""
      # -*- Entry points: -*-
      [z3c.autoinclude.plugin]
      target = plone
      """,
      )
